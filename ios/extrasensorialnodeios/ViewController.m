//
//  ViewController.m
//  extrasensorialnodeios
//
//  Created by Carlos Santos on 5/19/13.
//  Copyright (c) 2013 crsantos.info. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

#pragma mark SocketIODelegate methods

- (void) socketIODidConnect:(SocketIO *)socket{

    // Test send events
    DLog(@"sending ack...");
    [_socketIO sendEvent:@"ack" withData:@"LOL" andAcknowledge:^(id argsData) {
        DLog(@"Sent!")
    }];
}
- (void) socketIODidDisconnect:(SocketIO *)socket disconnectedWithError:(NSError *)error{
    DLog("Disconnected! %@", error);
}
- (void) socketIO:(SocketIO *)socket didReceiveMessage:(SocketIOPacket *)packet{
    DLog();
}
- (void) socketIO:(SocketIO *)socket didReceiveJSON:(SocketIOPacket *)packet{
    DLog();
}
- (void) socketIO:(SocketIO *)socket didReceiveEvent:(SocketIOPacket *)packet{

    DLog(@"Received: %@", packet);
    [_messages addObject:packet];
    [_tableView reloadData];
}
- (void) socketIO:(SocketIO *)socket didSendMessage:(SocketIOPacket *)packet{
    DLog();
}
- (void) socketIO:(SocketIO *)socket onError:(NSError *)error{
    DLog(@"error => %@", error);
}

#pragma mark - View lifecycle

- (void)viewDidLoad;
{
    [super viewDidLoad];
    _messages = [[NSMutableArray alloc] init];
    
    [self.tableView reloadData];
}

- (void)reconnect;
{
    _socketIO.delegate = self;
    [_socketIO disconnect];
    
    self.socketIO = [[SocketIO alloc] initWithDelegate:self];
    [_socketIO connectToHost:@"localhost" onPort:3000];
#warning IP ADDRESS AND PORT HARDCODED, demo purposes only

    self.title = @"Opening Connection...";
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self reconnect];
}

- (void)reconnect:(id)sender;
{
    [self reconnect];
}

- (void)viewDidAppear:(BOOL)animated;
{
    [super viewDidAppear:animated];
}

- (void)viewDidDisappear:(BOOL)animated
{
	[super viewDidDisappear:animated];
    
    _socketIO.delegate = nil;
    [_socketIO disconnect];
    self.socketIO = nil;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - UITableViewController Delegate && DataSource

- (void) configureCell:(UITableViewCell*)cell withIndexPath:(NSIndexPath*) indexPath{
    
    SocketIOPacket *message = [_messages objectAtIndex:indexPath.row];
    cell.textLabel.text = [NSString stringWithFormat:@"[%@] %@", message.type, message.data];
    cell.detailTextLabel.text = [NSString stringWithFormat:@"%d", indexPath.row];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
{
    return _messages.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath;
{
    static NSString* cellIdentifier = @"TableCell";
    UITableViewCell* cell = [self.tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell  alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:cellIdentifier];
    }
    
    [self configureCell:cell withIndexPath:indexPath];
        
    return cell;
}
     
@end
