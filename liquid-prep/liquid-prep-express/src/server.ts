import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import * as http from 'http';
import { util } from 'liquid-prep-lib';
import path from 'path';

import { Utils } from './common';

export class Server {
  app = express();
  apiUrl = `${process.env.SERVERLESS_ENDPOINT}`
  constructor(private port = 3000) {
    this.initialise()
  }

  initialise() {
    let app = this.app;
    const server = http.createServer(app);
    const utils = new Utils(server, this.port);

    app.use(cors({
      origin: '*'
    }));
    app.use(fileUpload());
  
    app.use('/static', express.static('public'));

    app.use('/', express.static('dist/liquid-prep-app'))
  
    app.get('/', (req: express.Request, res: express.Response, next: any) => { //here just add next parameter
      res.sendFile(
        path.resolve(__dirname, "index.html")
      )
      // next();
    })
  
    app.get("/staff", (req: express.Request, res: express.Response) => {
      res.json(["Jeff", "Gaurav"]);
    });
  
    app.get("/get_weather_info", (req: express.Request, res: express.Response, next) => {
      util.httpGet(`${this.apiUrl}/get_weather_info`)
      .subscribe({
        next: (data: any) => res.send(data),
        error: (err: any) => next(err)
      })  
      // @ts-ignore
      // let weather = new Weather(req.query.weatherApiKey, req.query.geoCode, req.query.language, req.query.units);
      // let fiveDaysWeatherInfo = weather.get5DaysForecast();
      // res.send({data: fiveDaysWeatherInfo});
    });
  
    app.get("/get_crop_list", (req: express.Request, res: express.Response, next) => {
      util.httpGet(`${this.apiUrl}/get_crop_list`)
      .subscribe({
        next: (data: any) => res.send(data),
        error: (err: any) => next(err)
      })  
    });

    app.get("/get_crop_info", (req: express.Request, res: express.Response, next) => {
      // @ts-ignore
      let id = req.query.id;
      util.httpGet(`${this.apiUrl}/get_crop_info?id=${id}`)
      .subscribe({
        next: (data: any) => res.send(data),
        error: (err: any) => next(err)
      })  
    });

    // app.get("*",  (req: express.Request, res: express.Response) => {
    //   res.sendFile(
    //       path.resolve( __dirname, "index.html" )
    //   )
    // });
  
    //app.listen(this.port, () => {
    //  console.log(`Started on ${this.port}`);
    //});
  }
}
