const express = require('express')
const app = express();

// Task A
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb:27017/HKPassFlow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
// Monitoring the connection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  process.exit(1); // Terminate the process
});
// Defining the schema
var monthLogSchema = new mongoose.Schema({
  Year: Number,
  Month: Number,
  Local: Number,
  Mainland: Number,
  Others: Number,
  Total: Number,
});
// Creating the model
var MonthLog = mongoose.model('MonthLog', monthLogSchema, 'monthlog');


// Task B
app.get('/HK/stat/:year/:month?', async (req, res, next) => {
    const year = req.params.year;
    let month = req.params.month;
    if (month === 'local' || month === 'mainland' || month === 'others') return next('route'); 

    try {
      // Check for valid year and month
      if (year < 2021 || year > 2025 || (month && (+month < 1 || +month > 12))) {
        return res.status(400).json({ "error": 'Wrong year - must be between 2021 - 2025. Wrong month.' });
      }
  
      let data;
      
      if (month) {
          // Retrieve data for a specific month and year
          data = await MonthLog.findOne({ Year: year, Month: +month }, { _id: 0 , __v:0});
          if (!data) {
            return res.status(404).json({ error: `No data for ${month}/${year}` });
          }
      } else {
        // Retrieve summary data for a specific year
        const records = await MonthLog.find({ Year: year }).lean();
        console.log('Found records:', records);
        if (records.length === 0) {
          return res.status(404).json({ error: `No data for ${year}` });
        }
        const summary = records.reduce((acc, record) => {
          acc.Local += record.Local;
          acc.Mainland += record.Mainland;
          acc.Others += record.Others;
          acc.Total += record.Total;
          return acc;
        }, { Year: year, Local: 0, Mainland: 0, Others: 0, Total: 0 });

        data = {
          Year: year,
          Local: summary.Local,
          Mainland: summary.Mainland,
          Others: summary.Others,
          Total: summary.Total
        };
        console.log('Data:', data);
      }
      res.json(data);
    } catch (err) {
      console.log('Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

// Task C
app.post('/HK/stat/', async (req, res) => {
  try {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      if (!body) {
        return res.status(400).json({ error: 'POST request - missing data.' });
      }

      const data = JSON.parse(body);
      const year = data[0].Year;
      const month = data[0].Month;
  
      // Check if record exists
      const existingRecord = await MonthLog.findOne({ Year: year, Month: month });
      if (existingRecord) {
        return res.status(409).json({ error: `Record exists for ${month}/${year}; cannot overwrite.` });
      }

      const arrival = data.find(item => item.Flow === 'Arrival');
      const departure = data.find(item => item.Flow === 'Departure');

      const local = arrival.Local - departure.Local;
      const mainland = arrival.Mainland - departure.Mainland;
      const others = arrival.Others - departure.Others;
      const totalArrivals = arrival.Local + arrival.Mainland + arrival.Others;
      const totalDepartures = departure.Local + departure.Mainland + departure.Others;
      const total = totalArrivals - totalDepartures;

      const newRecord = new MonthLog({
        Year: year,
        Month: month,
        Local: local,
        Mainland: mainland,
        Others: others,
        Total: total,
      });
      await newRecord.save();
      let data1;
      data1 = {
        Year: year,
        Month: month,
        Local: local,
        Mainland: mainland,
        Others: others,
        Total: total,
      }
      res.json(data1);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task D
app.get('/HK/stat/:year/:group', async (req, res) => {
  const { year, group } = req.params;

  try {
    // Check for valid year
    if (year < 2021 || year > 2025) {
      return res.status(400).json({ "error": 'Wrong year - must be between 2021 - 2025.' });
    }

    let data;

    const records = await MonthLog.find({ Year: year }).lean();
    console.log('Found records:', records);
    if (records.length === 0) {
      return res.status(404).json({ error: `No data for ${year}` });
    }
    // Retrieve data for the specified year and group
    if (group === 'local') {
      data = await MonthLog.find({ Year: year }, { _id: 0, Month: 1, Local: 1 }).sort({ Month: 1 });
    } else if (group === 'mainland') {
      data = await MonthLog.find({ Year: year }, { _id: 0, Month: 1, Mainland: 1 }).sort({ Month: 1 });
      console.log('Retrieving mainland data');
    } else if (group === 'others') {
      data = await MonthLog.find({ Year: year }, { _id: 0, Month: 1, Others: 1 }).sort({ Month: 1 });
    } else {
      return res.status(400).json({ error: 'Invalid group' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: `No data for ${year}` });
    }

    res.json(data);
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Task E
app.all('*', (req, res) => {
  res.status(400).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

app.listen(3000, () => {
 console.log('App listening on port 3000!')
});