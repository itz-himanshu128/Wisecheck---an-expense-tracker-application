-- Enable Row Level Security (RLS) on all tables to ensure data isolation
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowed ENABLE ROW LEVEL SECURITY;
ALTER TABLE lended ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only manage their own data

-- Profiles
CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Expenses
CREATE POLICY "Users can manage their own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Categories
CREATE POLICY "Users can manage their own categories" ON categories
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Expense Categories (Join table)
CREATE POLICY "Users can manage expense_categories for their expenses" ON expense_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM expenses WHERE expenses.id = expense_categories.expense_id AND expenses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM expenses WHERE expenses.id = expense_categories.expense_id AND expenses.user_id = auth.uid())
  );

-- Borrowed
CREATE POLICY "Users can manage their own borrowed entries" ON borrowed
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Lended
CREATE POLICY "Users can manage their own lended entries" ON lended
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Plans
CREATE POLICY "Users can manage their own plans" ON plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Budgets
CREATE POLICY "Users can manage their own budgets" ON budgets
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
