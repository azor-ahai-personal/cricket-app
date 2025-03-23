module Api
    module V1
        class ContestsController < ApplicationController

            before_action :require_login, only: [:index, :create, :show, :join]

            def index
                @contests = Contest.where(:user_ids.in => [@current_user.id])
                render 'api/v1/contests/index', formats: [:json]
            end

            def show
                @contest = Contest.find(params[:id])
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
        end
    end
end