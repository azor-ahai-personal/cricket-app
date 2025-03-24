module Api
  module V1
    class FantasyTeamsController < ApplicationController

      def index
        @fantasy_teams = current_user.fantasy_teams
        render 'api/v1/fantasy_teams/index', formats: [:json]
      end

      def create
        @fantasy_team = current_user.fantasy_teams.create(fantasy_team_params)
        return render json: { message: "Fantasy team created successfully" }, status: :created if @fantasy_team.save
        render status: :unprocessable_entity
      end 

      def show
        @fantasy_team = FantasyTeam.find(params[:id])
        if @fantasy_team.nil?
          return render json: { message: "Fantasy team not found" }, status: :not_found
        end
        render 'api/v1/fantasy_teams/show', formats: [:json]
      end

      private

      def fantasy_team_params
        params.require(:fantasy_team).permit(:name)
      end
    end
  end
end 