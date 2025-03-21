class Participation
    include Mongoid::Document
    include Mongoid::Timestamps

    belongs_to :user
    belongs_to :contest
    belongs_to :fantasy_team

    field :points, type: Integer, default: 0
    field :rank, type: Integer, default: 0

    validates :user_id, uniqueness: { scope: :contest_id }
end