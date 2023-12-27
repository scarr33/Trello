# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
# user = User.create(email:"suchak@gmail.com", password:"123456")

# User.create(email:"suchak1@gmail.com", password:"123456")
# User.create(email:"suchak2@gmail.com", password:"123456")
# User.create(email:"suchak3@gmail.com", password:"123456")
# User.create(email:"suchak4@gmail.com", password:"123456")
# User.create(email:"suchak5@gmail.com", password:"123456")

# 5.times do |i|
#   Board.create(user: user, name: "Board #{i + 1}")
# end

# Board.find_each do |board|
#   5.times {|i| List.create(board: board, title: "List #{i+1}")}

#   board.reload.lists.each do |list|
#     5.times {|i| Item.create(list: list, title: "Item #{i+1}", description: "Description for item #{i+1}")}
#   end
# end
