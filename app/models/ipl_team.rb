class IplTeam
    include Mongoid::Document
    include Mongoid::Timestamps

    has_many :players

    field :name, type: String
    field :short_name, type: String
    field :primary_color, type: String

    field :city, type: String

    validates :name, presence: true, uniqueness: true
end