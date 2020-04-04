//
//  WebView.swift
//  eqMac
//
//  Created by Romans Kisils on 13/07/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import WebKit

class EQMWebView: WKWebView {
    override init(frame: CGRect, configuration: WKWebViewConfiguration) {
        super.init(frame: frame, configuration: configuration)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
}
