//
//  ViewController.h
//  extrasensorialnodeios
//
//  Created by Carlos Santos on 5/19/13.
//  Copyright (c) 2013 crsantos.info. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SocketIO.h"
#import "SocketIOPacket.h"

@interface ViewController : UIViewController <SocketIODelegate>

@property (strong, nonatomic) NSMutableArray    *messages;
@property (strong, nonatomic) IBOutlet UITableView *tableView;
@property (strong, nonatomic) SocketIO *socketIO;
@end
