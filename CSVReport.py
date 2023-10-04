import json
import csv
import os
import re
import argparse  # Import the argparse module

# Create an argument parser
parser = argparse.ArgumentParser(description="Merge JSON files in a specified directory")

# Add an argument for the directory path
parser.add_argument('directory', help='Path to the directory containing JSON files')

# Parse the command-line arguments
args = parser.parse_args()

# Use the provided directory path
directory_path = args.directory

# Check if the provided directory exists
if not os.path.exists(directory_path):
    print("The specified directory does not exist.")
    exit(1)

# Define the output CSV file
output_csv_file = "merged_data.csv"

# Initialize a dictionary to store the data with days as keys
data_dict = {}

# Loop through all the files in the specified directory
for filename in os.listdir(directory_path):
    if filename.endswith(".json"):
        with open(os.path.join(directory_path, filename), 'r') as json_file:
            data = json.load(json_file)
            day_match = re.match(r'[^\d]*(\d+)[^\d]*', filename)
            if day_match:
                day = day_match.group(1)
            
            if filename.startswith('c'):
                # If the file starts with 'c', assume it's a count file
                count = data.get("count", "")
                temp = data_dict.get(day, {}).get("temp", "")
                hum = data_dict.get(day, {}).get("hum", "")
            else:
                # Otherwise, assume it's a temperature and humidity file
                temp = data.get("temp", "")
                hum = data.get("hum", "")
                count = data_dict.get(day, {}).get("count", "")
            
            # Create a dictionary entry for the day if it doesn't exist
            if day not in data_dict:
                data_dict[day] = {"day": day, "temp": temp, "hum": hum, "count": count}
            else:
                # Update the existing entry
                data_dict[day]["temp"] = temp
                data_dict[day]["hum"] = hum
                data_dict[day]["count"] = count

# Write the merged data to a CSV file
with open(output_csv_file, 'w', newline='') as csv_file:
    csv_writer = csv.DictWriter(csv_file, fieldnames=["day", "temp", "hum", "count"])
    
    # Write the header row
    csv_writer.writeheader()
    
    # Write the data rows
    csv_writer.writerows(data_dict.values())

print("Merged data has been saved to", output_csv_file)
