class ChildIssuesController < ApplicationController
  before_action :authenticate_user!

  # protect_from_forgery with: :null_session, only: :destroy

  def new
    @child_issue = item.child_issues.new
  end

  def create
    @child_issue = item.child_issues.new(child_issue_params)

    if @child_issue.save
      redirect_to item_path(item)
    else
      render :new
    end
  end

  def index
    @child_issue = item.child_issues
  end

  private

  def item
    @item ||= Item.find(params[:item_id])
  end

  def child_issue_params
    params.require(:child_issue).permit(:title, :description)
  end
end
