//
//  FileCenter.swift
//  AMGVoice
//
//  Created by GongYuhua on 2017/3/6.
//  Copyright © 2017年 Agora. All rights reserved.
//

import Foundation

struct FileCenter {
    private static let LocalLogRoot = "AMGSDKLogs"
    private static let AudioLogCacheName = "agorasdk"
    
    static let SharedLocalLogCacheRootPath: String = {
        let cacheDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first!
        
        let rootPath = "\(cacheDirectory)/\(LocalLogRoot)"
        if !FileManager.default.fileExists(atPath: rootPath, isDirectory: nil) {
            try? FileManager.default.createDirectory(atPath: rootPath, withIntermediateDirectories: true, attributes: nil)
        }
        return rootPath
    }()
    
    static func audioLogFilePath() -> String {
        return "\(SharedLocalLogCacheRootPath)/\(AudioLogCacheName).log"
    }
}
