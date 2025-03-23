class Contest
    include Mongoid::Document
    include Mongoid::Timestamps

    has_and_belongs_to_many :users
    belongs_to :owner, class_name: 'User', inverse_of: :owned_contests
   
    has_many :participations

    field :name, type: String
    field :passkey, type: String
    field :start_time, type: DateTime
    field :end_time, type: DateTime
    field :active, type: Boolean, default: false
    field :total_teams, type: Integer

    validates :passkey, presence: true, uniqueness: true
end