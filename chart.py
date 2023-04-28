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
temps = [float(d['temp'])/10 for d in data]
hums = [float(d['hum'])/10 for d in data]

plt.plot(dates, temps, label='Temperature')
plt.plot(dates, hums, label='Humidity')

plt.xlabel('Date')
plt.xticks(range(min(dates), max(dates)+1))
plt.ylabel('Value')
plt.legend()

#plt.show()
plt.savefig(f"{args.filename}.png")
