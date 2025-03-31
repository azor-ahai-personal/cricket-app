module Api
  module V1
    class FantasyTeamsController < ApplicationController

      def index
        @fantasy_teams = current_user.fantasy_teams
        render 'api/v1/fantasy_teams/index', formats: [:json]
      end

      def create
        @fantasy_team = current_user.fantasy_teams.create(fantasy_team_create_params)
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

      def update
        @fantasy_team = FantasyTeam.find(params[:id])
        if @fantasy_team.nil?
          return render json: { message: "Fantasy team not found" }, status: :not_found
        end
        if @fantasy_team.published?
          return render json: { message: "Fantasy team is published and cannot be updated" }, status: :unprocessable_entity
        end

        update_params = fantasy_team_update_params

        if update_params[:players].count > FantasyTeam::MAX_PLAYERS
          return render json: { message: "Invalid number of players: #{update_params[:players].count}, should have #{FantasyTeam::MAX_PLAYERS} players" }, status: :unprocessable_entity
        end
        players = Player.where(:id.in => update_params[:players]).to_a
        @fantasy_team.update!(players: players, captain_id: update_params[:captain_id], vice_captain_id: update_params[:vice_captain_id])
        render 'api/v1/fantasy_teams/show', formats: [:json]
      end

      def publish
        @fantasy_team = FantasyTeam.includes(:players).find(params[:id])
        if @fantasy_team.nil?
          return render json: { message: "Fantasy team not found" }, status: :not_found
        end
        is_valid, message = validate_fantasy_team
        if is_valid
          @fantasy_team.update(published: true)
          return render json: { message: "Fantasy team published successfully" }, status: :ok
        end
        render json: { message: "Invalid fantasy team" }, status: :unprocessable_entity
      end

      private

      def fantasy_team_create_params
        params.require(:fantasy_team).permit(:name)
      end

      def fantasy_team_update_params
        params.permit(:captain_id, :vice_captain_id, :players => [])
      end

      def validate_fantasy_team
        if @fantasy_team.players.count != FantasyTeam::MAX_PLAYERS
          return false, "Invalid number of players: #{@fantasy_team.players.count}, should have #{FantasyTeam::MAX_PLAYERS} players"
        end
        credit_sum = @fantasy_team.players.sum(:credit)
        if credit_sum > FantasyTeam::BUDGET
          return false, "Invalid credit sum: #{credit_sum}, should be less than #{FantasyTeam::BUDGET}"
        end
        num_batters = @fantasy_team.players.select { |player| player.role == "BATTER" }.count
        num_bowlers = @fantasy_team.players.select { |player| player.role == "BOWLER" }.count
        num_all_rounders = @fantasy_team.players.select { |player| player.role == "ALL_ROUNDER" }.count
        if num_batters < FantasyTeam::MIN_BATTERS || num_bowlers < FantasyTeam::MIN_BOWLERS || num_all_rounders < FantasyTeam::MIN_ALL_ROUNDERS
          return false, "Invalid distribution of players, #{num_batters} batsmen, #{num_bowlers} bowlers, #{num_all_rounders} all-rounders. Should have at least #{FantasyTeam::MIN_BATTERS} batsmen, #{FantasyTeam::MIN_BOWLERS} bowlers and #{FantasyTeam::MIN_ALL_ROUNDERS} all-rounders"
        end
        if @fantasy_team.captain_id.nil? || @fantasy_team.vice_captain_id.nil?
          return false, "Captain or vice captain not selected"
        end
        true
      end
    end
  end
end 