import UIKit

class SignInViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        setupUI()
    }
    
    private func setupUI() {
        let signInLabel = UILabel()
        signInLabel.text = "Sign In"
        signInLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(signInLabel)
        
        NSLayoutConstraint.activate([
            signInLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            signInLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}