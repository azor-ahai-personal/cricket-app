import pandas as pd
import os

# Path to the data directory
data_dir = '/Users/uddeshkatyayan/cricket-app/data'

# Initialize an empty list to hold DataFrames
data_frames = []

# Loop through each file in the data directory
for filename in os.listdir(data_dir):
    if filename.endswith('.csv'):
        file_path = os.path.join(data_dir, filename)
        df = pd.read_csv(file_path)
        data_frames.append(df)

# Concatenate all DataFrames into a single DataFrame
all_data = pd.concat(data_frames, ignore_index=True)

# Rename columns for consistency
all_data.columns = ['Name', 'Team', 'Role', 'Indian', 'Credits']

# Analyze player distribution and credit scores
role_counts = all_data['Role'].value_counts()
credit_stats = all_data.groupby('Role')['Credits'].describe()

average_credit_limit = all_data['Credits'].mean()
median_credit_limit = all_data['Credits'].median()

print(f"Average Credit Limit: {average_credit_limit:.2f}")
print(f"Median Credit Limit: {median_credit_limit:.2f}")

print("Player Distribution by Role:")
print(role_counts)
print("\nCredit Score Statistics by Role:")
print(credit_stats)

# Suggest a credit limit based on the analysis
# For example, we can take the average credit score across all roles
average_credit_limit = all_data['Credits'].mean()

suggested_mean_credit_limit = average_credit_limit * 11 * 1.1
suggested_median_credit_limit = median_credit_limit * 11 * 1.1


print(f"\nSuggested Credit Limit Mean: {suggested_mean_credit_limit:.2f}")
print(f"\nSuggested Credit Limit Median: {suggested_median_credit_limit:.2f}")
print(f"\nSuggested Credit Limit Average: {(suggested_mean_credit_limit+suggested_median_credit_limit)/2:.2f}")