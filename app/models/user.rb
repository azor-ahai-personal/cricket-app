class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include ActiveModel::SecurePassword

  has_many :fantasy_teams, class_name: 'FantasyTeam'
  has_and_belongs_to_many :contests, class_name: 'Contest'
  has_many :participations, class_name: 'Participation'

  field :email, type: String
  field :password_digest, type: String

  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
end 