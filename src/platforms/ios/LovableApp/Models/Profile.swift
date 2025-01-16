import Foundation

struct Profile: Codable {
    let id: String
    let fullName: String?
    let phone: String?
    let gender: String?
    let age: String?
    let complaint: String?
    let role: String
    let password: String
    let paymentStatus: String?
    let paymentMethod: String?
    let paymentDate: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case fullName = "full_name"
        case phone
        case gender
        case age
        case complaint
        case role
        case password
        case paymentStatus = "payment_status"
        case paymentMethod = "payment_method"
        case paymentDate = "payment_date"
    }
}