import Foundation

struct Message: Codable {
    let id: String
    let content: String
    let userId: String
    let isFromDoctor: Bool
    let isRead: Bool
    let createdAt: Date
    let fileUrl: String?
    let fileName: String?
    let fileType: String?
    let duration: Int?
    
    enum CodingKeys: String, CodingKey {
        case id
        case content
        case userId = "user_id"
        case isFromDoctor = "is_from_doctor"
        case isRead = "is_read"
        case createdAt = "created_at"
        case fileUrl = "file_url"
        case fileName = "file_name"
        case fileType = "file_type"
        case duration
    }
}