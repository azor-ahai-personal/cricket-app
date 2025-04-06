module Api
    module V1
        class ContestsController < ApplicationController

            before_action :require_login, only: [:index, :create, :show, :join]

            def index
                @contests = Contest.where(:user_ids.in => [@current_user.id])
                render 'api/v1/contests/index', formats: [:json]
            end

            def show
                @contest = Contest.includes(participations: :fantasy_team).find(params[:id])
                render 'api/v1/contests/show', formats: [:json]
            end

            def create
                passkey = generate_unique_passkey
                @contest = Contest.new(contest_params.merge(
                    passkey: passkey, 
                    active: false,
                    user_ids: [@current_user.id],
                    owner: @current_user
                ))
                puts "contest_params: #{contest_params}"
                if @contest.save
                    render 'api/v1/contests/show', formats: [:json]
                else
                    render json: { errors: @contest.errors.full_messages }, status: :unprocessable_entity
                end
            end

            def update
                @contest = Contest.find(params[:id])
                if @contest.nil?
                    render json: { error: "Contest not found" }, status: :not_found
                    return
                end 
                if @contest.update(update_params)
                    render 'api/v1/contests/show', formats: [:json]
                else
                    render json: { errors: @contest.errors.full_messages }, status: :unprocessable_entity
                end
            end

            def join
                contest = Contest.find_by(passkey: params[:passkey])
                if contest.nil?
                    render json: { error: "Contest not found" }, status: :not_found
                    return
                end
                if contest.user_ids.include?(@current_user.id)
                    render json: { error: "You are already in this contest" }, status: :unprocessable_entity
                    return
                end
                contest.user_ids << @current_user.id
                contest.save!
                render json: { message: "Joined contest successfully" }, status: :ok
            end

            def participate
                @contest = Contest.find(params[:id])
                if @contest.nil?
                    render json: { error: "Contest not found" }, status: :not_found
                    return
                end

                user_validation = validate_user_participation(params[:user_id], params[:fantasy_team_id])
                unless user_validation[:valid]
                    render json: { error: user_validation[:error] }, status: :unprocessable_entity
                    return
                end

                team_validation = validate_top_teams(params[:top_teams])
                unless team_validation[:valid]
                    render json: { error: team_validation[:error] }, status: :unprocessable_entity
                    return
                end

                player_validation = validate_players([params[:orange_cap_player_id], params[:purple_cap_player_id], params[:player_of_the_tournament_id]])
                unless player_validation[:valid]
                    render json: { error: player_validation[:error] }, status: :unprocessable_entity
                    return
                end

                participations = Participation.new(
                    user_id: params[:user_id], 
                    fantasy_team_id: params[:fantasy_team_id], 
                    contest_id: @contest.id,
                    orange_cap_player_id: params[:orange_cap_player_id],
                    purple_cap_player_id: params[:purple_cap_player_id],
                    player_of_the_tournament_id: params[:player_of_the_tournament_id],
                    top_teams: params[:top_teams],
                )

                if participations.save
                    render json: { message: "Participated in contest successfully" }, status: :ok
                else
                    render json: { errors: participations.errors.full_messages }, status: :unprocessable_entity
                end
            end

            def activate
                @contest = Contest.find(params[:id])
                if @contest.nil?
                    render json: { error: "Contest not found" }, status: :not_found
                    return
                end
                if @contest.active
                    render json: { error: "Contest is already active" }, status: :unprocessable_entity
                    return
                end
                @contest.active = true
                @contest.start_time = Time.now
                @contest.save!
                render json: { message: "Contest activated successfully" }, status: :ok
            end
                
            private

            def generate_unique_passkey
                loop do
                    # Generate two random words (2-3 letters each) separated by a hyphen
                    word1 = generate_random_word(2..3)
                    word2 = generate_random_word(2..3)
                    passkey = "#{word1}-#{word2}"
                    break passkey unless Contest.exists?(passkey: passkey)
                end
            end

            def generate_random_word(length_range)
                # Generate a random word with letters between A-Z
                length = rand(length_range)
                (0...length).map { ('A'..'Z').to_a.sample }.join
            end

            def contest_params
                params.require(:contest).permit(:name, :entry_fee)
            end

            def update_params
                params.require(:contest).permit(:active)
            end

            def validate_user_participation(user_id, fantasy_team_id)
                return { valid: false, error: "User ID and Fantasy Team ID are required" } if user_id.nil? || fantasy_team_id.nil?

                user = User.find(user_id)
                fantasy_team = FantasyTeam.find(fantasy_team_id)

                return { valid: false, error: "User or Fantasy Team not found" } if user.nil? || fantasy_team.nil?
                return { valid: false, error: "You are not authorized to participate in this contest because you are not the owner of the team" } if user.id != @current_user.id
                return { valid: false, error: "You are not authorized to participate in this contest because you are not the owner of the team" } if fantasy_team.user_id != @current_user.id
                return { valid: false, error: "You are not authorized to participate in this contest because the team is not published" } if fantasy_team.published == false
                return { valid: false, error: "You are not authorized to participate in this contest because you are already in the contest" } if @contest.participations.where(user_id: user_id, fantasy_team_id: fantasy_team_id).exists?

                { valid: true }
            end

            def validate_top_teams(top_teams)

                return { valid: false, error: "You must select exactly 4 teams" } if top_teams.length != 4

                teams = IplTeam.where(:id.in => top_teams)
                return { valid: false, error: "You must select exactly 4 teams" } if teams.length != 4

                { valid: true }
            end

            def validate_players(player_ids)
                return { valid: false, error: "Orange Cap, Purple Cap, and Player of the Tournament are required" } if player_ids.nil? || player_ids.length != 3

                unique_players = player_ids.uniq
                
                players = Player.where(:id.in => unique_players)
                return { valid: false, error: "Wrong player IDs provided" } if players.length != unique_players.length

                { valid: true }
            end
            
        end
    end
end