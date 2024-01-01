class AddPositionsToLists < ActiveRecord::Migration[7.1]
  def change
    add_column :lists, :position, :integer, null: false, default: 0
  end
end
