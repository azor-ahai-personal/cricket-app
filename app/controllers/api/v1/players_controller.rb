module Api
  module V1
    class PlayersController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        @teams = IplTeam.all.includes(:players)
        render 'api/v1/players/details', formats: [:json]
      end
    end
  end
end 