class Contest
    include Mongoid::Document
    include Mongoid::Timestamps

    has_and_belongs_to_many :users
   
    has_many :participations

    field :name, type: String
    field :passkey, type: String
    field :start_time, type: DateTime
    field :end_time, type: DateTime
    field :status, type: String
    field :total_teams, type: Integer
end