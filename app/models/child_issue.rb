class ChildIssue < ApplicationRecord
  belongs_to :item

  validates :title, presence: true
end
