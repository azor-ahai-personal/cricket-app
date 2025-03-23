class FantasyTeam
    include Mongoid::Document
    include Mongoid::Timestamps

    belongs_to :user
    has_many :participations
    has_many :contests

    has_many :players

    field :name, type: String
    field :budget, type: Integer
    field :captain_id, type: String
    field :vice_captain_id, type: String
    field :archived, type: Boolean, default: false

    field :published, type: Boolean, default: false
    
    validates :name, presence: true
    validates :captain_id, presence: true
    validates :vice_captain_id, presence: true
end