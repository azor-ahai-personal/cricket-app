class FantasyTeam
    include Mongoid::Document
    include Mongoid::Timestamps

    BUDGET = 1100
    MAX_PLAYERS = 11
    MIN_BATTERS = 3
    MIN_BOWLERS = 3
    MIN_ALL_ROUNDERS = 2

    belongs_to :user
    has_many :participations
    has_many :contests
    has_and_belongs_to_many :players, class_name: 'Player', inverse_of: :fantasy_teams

    field :name, type: String
    field :credits_spent, type: Integer, default: 0
    field :captain_id, type: String
    field :vice_captain_id, type: String
    field :archived, type: Boolean, default: false
    field :published, type: Boolean, default: false

    validates :name, presence: true
    validates :captain_id, presence: true, if: -> { published? }
    validates :vice_captain_id, presence: true, if: -> { published? }
    validate :credits_spent_cannot_exceed_budget

    private

    def credits_spent_cannot_exceed_budget
        if credits_spent >= BUDGET
            errors.add(:credits_spent, "Credits spent cannot exceed budget")
        end
    end
end