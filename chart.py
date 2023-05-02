import argparse
import json
import matplotlib.pyplot as plt

# Create an ArgumentParser object
parser = argparse.ArgumentParser()

# Add an argument for the JSON file name
parser.add_argument('filename', help='Name of JSON file')

# Parse the command-line arguments
args = parser.parse_args()

# Load data from the JSON file
with open(args.filename, 'r') as f:
    data = json.load(f)

dates = [int(d['date']) for d in data]
temps = [float(d['hum'])/10 for d in data]
hums = [float(d['temp'])/10 for d in data]
# Create subplots for temperature and humidity
fig, (ax1, ax2) = plt.subplots(nrows=2, ncols=1, sharex=True)

# Plot temperature data
ax1.bar(dates, temps, label='Temperature')
ax1.set_ylabel('Temperature')

# Plot humidity data
ax2.bar(dates, hums, label='Humidity')
ax2.set_ylabel('Humidity')

# Set x-axis label and tick marks
plt.xlabel('Date')
plt.xticks(range(min(dates), max(dates)+1))

# Add legend to each subplot
ax1.legend()
ax2.legend()

#plt.show()
plt.savefig(f"{args.filename}.png")
#plt.bar(dates, temps, label='Temperature')
#plt.bar(dates, hums, label='Humidity')

#plt.xlabel('Date')
#plt.xticks(range(min(dates), max(dates)+1))
#plt.ylabel('Value')
#plt.legend()

#plt.show()
#plt.savefig(f"{args.filename}.png")
