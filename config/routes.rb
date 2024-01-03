Rails.application.routes.draw do
  devise_for :users
  get 'login/index'
  # get 'home/index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  # root "home#index"
  root to: "home#index"
  get "/register", to:"register#index"
  get "/login", to:"login#index"
  get "users/profile", to:"profile#index"
  get "/dashboard", to:"dashboard#index"

  # resources :boards, only: [:new, :edit, :create, :update, :destroy, :show]

  resources :boards do
    resources :lists, except: :show
    resources :board_users, only: [:new, :create]
  end

  resources :items do
    resources :item_members, only: [:new, :create]
  end

  resources :lists do
    resources :items
  end


  namespace :api do
    resources :boards do
      resources :lists, only: [:index, :update], controller: "lists"
      resources :list_positions, only: [:index, :update], controller: "list_positions"
    end
    put "item_positions", to:"item_positions#update"

    resources :items, only: :show
  end
end
