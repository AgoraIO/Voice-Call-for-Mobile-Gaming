//
//  GameScene.swift
//  AMGVoice
//
//  Created by GongYuhua on 2017/1/3.
//  Copyright © 2016年 Agora. All rights reserved.
//

import SpriteKit

private struct PhysicsCategory {
    static let None       : UInt32 = 0
    static let All        : UInt32 = UInt32.max
    static let Star       : UInt32 = 0b1
    static let Speaker    : UInt32 = 0b10
}

protocol GameSceneDelegate: NSObjectProtocol {
    func gameScene(scene: GameScene, didMoveSpeakerOfUid uid: UInt, pan : CGFloat, gain: CGFloat)
    func gameSceneShouldPlayAudioEffect(scene: GameScene) -> Bool
    func gameScene(scene: GameScene, needPlayEffectResource resource: String, ofType type: String, atPan pan: CGFloat)
}

class GameScene: SKScene {
    
    weak var eventDelegate: GameSceneDelegate?
    
    fileprivate let ship = SKSpriteNode(imageNamed: "spaceship")
    fileprivate var speakerPool = [UInt: SKNode]()
    fileprivate var selectedSpeaker: SKNode? {
        didSet {
            unselectSpeaker(oldValue)
            if let selectedSpeaker = selectedSpeaker {
                selectSpeaker(selectedSpeaker)
            }
            selectedSpeakerOrigin = selectedSpeaker?.position
        }
    }
    fileprivate var selectedTouchOrigin: CGPoint?
    fileprivate var selectedSpeakerOrigin: CGPoint?
    fileprivate let kSpeakerNodeName = "speakerNode"
    fileprivate let kSpeakerRadius: CGFloat = 40
    fileprivate lazy var availablePeerRect: CGRect = {
        let width = self.size.width - self.kSpeakerRadius * 2
        let height = UIScreen.main.bounds.size.height
        
        return CGRect(x: self.kSpeakerRadius, y: 0, width: width, height: height - self.kSpeakerRadius * 4)
    }()
    fileprivate var alertLabelNode: SKLabelNode?
    
    override func didMove(to view: SKView) {
        backgroundColor = SKColor.white
        
        ship.position = CGPoint(x: size.width * 0.5, y: size.height * 0.1)
        addChild(ship)
        
        physicsWorld.gravity = CGVector.zero
        physicsWorld.contactDelegate = self
        
        run(SKAction.repeatForever(
            SKAction.sequence([
                SKAction.run(addDust),
                SKAction.wait(forDuration: 1.0)
            ])
        ))
    }
    
    func addSpeaker(of uid: UInt) {
        if let _ = speakerPool[uid] {
            return
        } else {
            let speaker = createSpeaker()
            speakerPool[uid] = speaker
            addChild(speaker)
        }
    }
    
    func removeSpeaker(of uid: UInt) {
        guard let speaker = speakerPool[uid] else {
            return
        }
        
        speaker.removeFromParent()
        speakerPool[uid] = nil
    }
    
    func removeAllSpeakers() {
        for (_, speaker) in speakerPool {
            speaker.removeFromParent()
        }
        speakerPool.removeAll()
    }
    
    func uidOfSpeaker(_ speaker: SKNode) -> UInt? {
        for (uid, node) in speakerPool {
            if node == speaker {
                return uid
            }
        }
        return nil
    }
    
    func showVolume(_ volume: UInt, of uid: UInt) {
        guard let speaker = speakerPool[uid] as? SKShapeNode else {
            return
        }
        addVolumeNode(of: volume, to: speaker)
    }
    
    func alertString(_ string: String) {
        addAlertStringNode(of: string)
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else {
            selectedSpeaker = nil
            selectedTouchOrigin = nil
            return
        }
        let position = touch.location(in: self)
        
        selectedSpeaker = selectedSpeaker(at: position)
        if let _ = selectedSpeaker {
            selectedTouchOrigin = position
        }
    }
    
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first, let speaker = selectedSpeaker,
            let selectedTouchOrigin = selectedTouchOrigin  else {
            return
        }
        
        let position = touch.location(in: self)
        let translation = position - selectedTouchOrigin
        moveSpeaker(speaker, by: translation)
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        if let selectedSpeaker = selectedSpeaker {
            
            if let uid = uidOfSpeaker(selectedSpeaker) {
                let (pan, gain) = panAndGain(of: selectedSpeaker.position)
                eventDelegate?.gameScene(scene: self, didMoveSpeakerOfUid: uid, pan: pan, gain: gain)
            }
            
            self.selectedSpeaker = nil
            self.selectedTouchOrigin = nil
        } else if let touch = touches.first {
            let touchLocation = touch.location(in: self)
            fireStar(to: touchLocation)
        }
    }
}

private extension GameScene {
    func addDust() {
        let dust = SKSpriteNode(imageNamed: "dust")
        
        let actualX = random(min: dust.size.width/2, max: size.width - dust.size.width/2)
        dust.position = CGPoint(x: actualX, y: size.height + dust.size.width/2)
        dust.zPosition = -2
        addChild(dust)
        
        let actualDuration = random(min: CGFloat(2.0), max: CGFloat(4.0))
        
        let actionMove = SKAction.move(to: CGPoint(x: actualX, y: -dust.size.height/2), duration: TimeInterval(actualDuration))
        let actionMoveDone = SKAction.removeFromParent()
        
        dust.run(SKAction.sequence([actionMove, actionMoveDone]))
    }
    
    func starDidCollide(star: SKNode, with speaker: SKNode) {
        guard speaker != selectedSpeaker else {
            return
        }
        
        star.removeFromParent()
        
        if let shouldPlay = eventDelegate?.gameSceneShouldPlayAudioEffect(scene: self),
            !shouldPlay {
            let (pan, _) = panAndGain(of: speaker.position)
            eventDelegate?.gameScene(scene: self, needPlayEffectResource: "boom", ofType: "mp3", atPan: pan)
        } else {
            run(SKAction.playSoundFileNamed("boom.mp3", waitForCompletion: false))
        }
    }
    
    func fireStar(to location: CGPoint) {
        let star = SKSpriteNode(imageNamed: "star")
        star.position = ship.position + CGPoint(x: 0, y: 5)
        star.physicsBody = SKPhysicsBody(circleOfRadius: star.size.width / 2)
        star.physicsBody?.isDynamic = true
        star.physicsBody?.categoryBitMask = PhysicsCategory.Star
        star.physicsBody?.contactTestBitMask = PhysicsCategory.Speaker
        star.physicsBody?.collisionBitMask = PhysicsCategory.None
        star.physicsBody?.usesPreciseCollisionDetection = true
        let offset = location - star.position
        if (offset.y < 0) {
            return
        }
        star.zPosition = -1
        addChild(star)
        
        let direction = offset.normalized()
        let shootAmount = direction * 1000
        let realDest = shootAmount + star.position
        
        let actionMove = SKAction.move(to: realDest, duration: 1.5)
        let rotation = SKAction.rotate(byAngle: 18, duration: 1.5)
        let actionMoveDone = SKAction.removeFromParent()
        
        star.run(SKAction.sequence([SKAction.group([actionMove, rotation]), actionMoveDone]))
        
        if let shouldPlay = eventDelegate?.gameSceneShouldPlayAudioEffect(scene: self),
            !shouldPlay {
            eventDelegate?.gameScene(scene: self, needPlayEffectResource: "shoot", ofType: "mp3", atPan: 0)
        } else {
            run(SKAction.playSoundFileNamed("shoot.mp3", waitForCompletion: false))
        }
    }
    
    func addVolumeNode(of vol: UInt, to speaker: SKShapeNode) {
        let radius = volumeRadius(of: vol)
        guard radius > 0 else {
            return
        }
        
        let volume = SKShapeNode(circleOfRadius: kSpeakerRadius)
        volume.lineWidth = 0.5
        volume.strokeColor = speaker.fillColor
        
        volume.position = speaker.position
        addChild(volume)
        
        let scale = SKAction.scale(to: radius/kSpeakerRadius, duration: 0.15)
        let fade = SKAction.fadeOut(withDuration: 0.2)
        let remove = SKAction.removeFromParent()
        volume.run(SKAction.sequence([scale, fade, remove]))
    }
    
    func volumeRadius(of vol: UInt) -> CGFloat {
        if vol <= 100 {
            return 0
        } else {
            return kSpeakerRadius * (1.15 + (CGFloat(vol) - 100)/200)
        }
    }
    
    func addAlertStringNode(of string: String) {
        alertLabelNode?.removeAllActions()
        alertLabelNode?.removeFromParent()
        
        let alert = SKLabelNode(text: string)
        alert.fontSize = 16
        alert.fontName = "AmericanTypewriter-Bold"
        alert.position = ship.position + CGPoint(x: 0, y: 88)
        alert.fontColor = SKColor.red
        addChild(alert)
        
        let waite = SKAction.wait(forDuration: 3)
        let fade = SKAction.fadeOut(withDuration: 1)
        let remove = SKAction.removeFromParent()
        alert.run(SKAction.sequence([waite, fade, remove]))
        
        alertLabelNode = alert
    }
}

//MARK: speaker
private extension GameScene {
    func createSpeaker() -> SKNode {
        let radius = kSpeakerRadius
        let speaker = SKShapeNode(circleOfRadius: radius)
        speaker.fillColor = randomColor()
        speaker.name = kSpeakerNodeName
        speaker.physicsBody = SKPhysicsBody(circleOfRadius: radius)
        speaker.physicsBody?.isDynamic = true
        speaker.physicsBody?.categoryBitMask = PhysicsCategory.Speaker
        speaker.physicsBody?.contactTestBitMask = PhysicsCategory.Star
        speaker.physicsBody?.collisionBitMask = PhysicsCategory.None
        let X = UIScreen.main.bounds.width
        let randX = CGFloat(arc4random_uniform(UInt32(X - availablePeerRect.midX)));
        var randY = CGFloat(arc4random_uniform(UInt32(availablePeerRect.maxY)));
        if(randY < UIScreen.main.bounds.size.height - 98)
        {
            randY = UIScreen.main.bounds.size.height - 98
        }
        speaker.position = CGPoint(x: randX, y: randY)
        speaker.zPosition = 3
        return speaker
    }
    
    func randomColor() -> UIColor {
        return UIColor(red: random(min: 0.02, max: 0.98),
                       green: random(min: 0.02, max: 0.98),
                       blue: random(min: 0.02, max: 0.98),
                       alpha: 1)
    }
    
    func isSpeaker(of node: SKNode) -> Bool {
        return node.name == kSpeakerNodeName
    }
    
    func selectedSpeaker(at position: CGPoint) -> SKNode? {
        let node = atPoint(position)
        if isSpeaker(of: node) {
            return node
        } else {
            return nil
        }
    }
    
    func selectSpeaker(_ speaker: SKNode) {
        speaker.removeAllActions()
        speaker.run(SKAction.scale(to: 1.1, duration: 0.1))
    }
    
    func unselectSpeaker(_ speaker: SKNode?) {
        speaker?.removeAllActions()
        speaker?.run(SKAction.scale(to: 1, duration: 0.1))
    }
    
    func moveSpeaker(_ speaker: SKNode, by translation: CGPoint) {
        guard let selectedSpeakerOrigin = selectedSpeakerOrigin else {
            return
        }
        let newPosition = selectedSpeakerOrigin + translation
        if availablePeerRect.contains(newPosition) {
            speaker.position = newPosition
        } else if newPosition.x > availablePeerRect.minX && newPosition.x < availablePeerRect.maxX {
            speaker.position = CGPoint(x: newPosition.x, y: speaker.position.y)
        } else if newPosition.y > availablePeerRect.minY && newPosition.y < availablePeerRect.maxY {
            speaker.position = CGPoint(x: speaker.position.x, y: newPosition.y)
        }
    }
}

private extension GameScene {
    func random() -> CGFloat {
        return CGFloat(Float(arc4random()) / 0xFFFFFFFF)
    }
    
    func random(min: CGFloat, max: CGFloat) -> CGFloat {
        return random() * (max - min) + min
    }
    
    func panAndGain(of point: CGPoint) -> (pan: CGFloat, gain: CGFloat) {
        let midBottom = CGPoint(x: availablePeerRect.midX, y: availablePeerRect.minY)
        let direction = point - midBottom
        
        var pan: CGFloat = 0
        if direction == CGPoint.zero {
            pan = 0
        } else if direction.y == 0 {
            pan = direction.x > 0 ? 1 : -1
        } else {
            pan = CGFloat(atan(Double(direction.x) / Double(direction.y)) / (Double.pi / 2))
        }
        
        var gain = 100 - 50 * direction.length() / availablePeerRect.size.height
        if gain < 20 {
            gain = 20
        }
        
        return (pan, gain)
    }
}

extension GameScene: SKPhysicsContactDelegate {
    func didBegin(_ contact: SKPhysicsContact) {
        
        var firstBody: SKPhysicsBody
        var secondBody: SKPhysicsBody
        if contact.bodyA.categoryBitMask < contact.bodyB.categoryBitMask {
            firstBody = contact.bodyA
            secondBody = contact.bodyB
        } else {
            firstBody = contact.bodyB
            secondBody = contact.bodyA
        }
        
        if let star = firstBody.node, let speaker = secondBody.node,
            (firstBody.categoryBitMask & PhysicsCategory.Star != 0) &&
            (secondBody.categoryBitMask & PhysicsCategory.Speaker != 0) {
            starDidCollide(star: star, with: speaker)
        }
    }
}
