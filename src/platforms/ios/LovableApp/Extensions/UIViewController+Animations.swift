import UIKit

extension UIViewController {
    func animateIn(_ view: UIView) {
        view.transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
        view.alpha = 0
        
        UIView.animate(withDuration: 0.3, delay: 0, usingSpringWithDamping: 0.7, initialSpringVelocity: 0.5) {
            view.transform = .identity
            view.alpha = 1
        }
    }
    
    func animateOut(_ view: UIView, completion: @escaping () -> Void) {
        UIView.animate(withDuration: 0.3, animations: {
            view.transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
            view.alpha = 0
        }) { _ in
            completion()
        }
    }
}