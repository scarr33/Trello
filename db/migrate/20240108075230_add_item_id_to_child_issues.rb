class AddItemIdToChildIssues < ActiveRecord::Migration[7.1]
  def change
    add_reference :child_issues, :item, null: false, foreign_key: true
  end
end
