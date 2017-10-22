//
//  API.m
//  eqMac2
//
//  Created by Romans Kisils on 14/05/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "API.h"

@implementation API

+(void)startPinging{
    [self ping];
    [Utilities executeBlock:^{ [self ping]; } every:300];
}

+(void)ping{
    NSMutableDictionary *user = [[NSMutableDictionary alloc] init];
    [user setObject:[Utilities getMacModel] forKey:@"model"];
    [user setObject:[Utilities getOSXVersion] forKey:@"osx_version"];
    [user setObject:[Utilities getAppVersion] forKey:@"app_version"];
    
    [self apiRequestWithMethod:@"POST"
                   andEndPoint:[NSString stringWithFormat:@"/user/%@", [Utilities getUUID]]
                       andBody:user
                       andCallback: nil];
}

+(void)sendPresets{
    NSDictionary *presets = [Presets getUserPresets];
    [self apiRequestWithMethod:@"POST"
                   andEndPoint:[NSString stringWithFormat:@"/user/%@/presets", [Utilities getUUID]]
                       andBody:presets
                   andCallback: nil];
}

+(void)apiRequestWithMethod:(NSString *)method andEndPoint:(NSString *)endpoint andBody:(id)body andCallback: (void (^)(id _Nullable resp, NSError * _Nullable err)) cb{
    AFHTTPSessionManager *http = [[AFHTTPSessionManager alloc]initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    
    //Set Headers
    http.requestSerializer = [AFJSONRequestSerializer serializer];
    [http.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    //Construct URL
    NSString *url = [API_URL stringByAppendingString:endpoint];
    
    id sucCB = ^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if(cb)
            cb(responseObject, nil);
    };
    
    id errCB = ^(NSURLSessionDataTask * _Nullable task, NSError * _Nullable error) {
        if(cb)
            cb(nil, error);
    };

    if([method isEqualToString:@"GET"]){
        [http GET:url parameters:nil progress:nil success: sucCB failure: errCB];
    }else if([method isEqualToString:@"POST"]){
        [http POST:url parameters:body progress:nil success: sucCB failure: errCB];
    }else{
        if(cb)
            cb(nil, [NSError errorWithDomain:@"Invalid Method" code:401 userInfo:nil]);
    }

}


@end
