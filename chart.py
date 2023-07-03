import argparse
import json
import matplotlib.pyplot as plt

# Create an ArgumentParser object
parser = argparse.ArgumentParser()

# Add an argument for the JSON file name
parser.add_argument('filename', help='Name of JSON file')
parser.add_argument('count')
# Parse the command-line arguments
args = parser.parse_args()
print(args.count)
# Load data from the JSON file
with open(args.filename, 'r') as f:
    data = json.load(f)
with open(args.count,'r') as f:
    countData = json.load(f)
dates = [int(d['date']) for d in data]
temps = [float(d['hum'])/10 for d in data]
hums = [float(d['temp'])/10 for d in data]

cDates = [int(d['date']) for d in countData]
cCount = [int(d['count']) for d in countData]
# Create subplots for temperature and humidity
fig, (ax1, ax2,ax3) = plt.subplots(nrows=3, ncols=1, sharex=True)

# Plot temperature data
ax1.bar(dates, temps, label='Temperature')
ax1.set_ylabel('Temperature')

# Plot humidity data
ax2.bar(dates, hums, label='Humidity')
ax2.set_ylabel('Humidity')


ax3.bar(cDates,cCount,label='Count')
ax3.set_ylabel('Count')

# Set x-axis label and tick marks
plt.xlabel('Date')
plt.xticks(range(min(dates), max(dates)+1))

# Add legend to each subplot
ax1.legend()
ax2.legend()
ax3.legend()
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
