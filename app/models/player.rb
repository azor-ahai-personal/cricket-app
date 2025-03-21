class Player
    include Mongoid::Document
    include Mongoid::Timestamps

    belongs_to :team, class_name: 'IplTeam'

    field :name, type: String
    field :role, type: String
    field :indian, type: Boolean, default: true
    field :credits, type: Integer

    validates :name, presence: true
    validates :role, presence: true
    validates :credits, presence: true, 
              numericality: { only_integer: true, greater_than_or_equal_to: 50, less_than_or_equal_to: 120 }

    # Scopes for easy querying
    scope :batters, -> { where(role: 'BATTERS') }
    scope :bowlers, -> { where(role: 'BOWLERS') }
    scope :allrounders, -> { where(role: 'ALLROUNDERS') }
    scope :indians, -> { where(indian: true) }
    scope :overseas, -> { where(indian: false) }
end 