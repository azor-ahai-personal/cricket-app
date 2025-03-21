class Team
    include Mongoid::Document
    include Mongoid::Timestamps

    has_many :users

    field :name, type: String
end
