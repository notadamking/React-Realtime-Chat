# Slack in React
A full-stack reproduction of the popular realtime chat application, Slack (http://slack.com). This stack was built with a focus on scalability, efficiency, performance, and simplicity.

## Stack
- React (w/ Server-side Rendering)
- Redux
- Apollo/GraphQL
- Express
- Webpack
- Babel (ES7)
- React-Hot-Reloader
- PostCSS
- Eslint

## Getting Started
### Installation
```bash
git clone https://github.com/adamjking3/React-Realtime-Chat.git
cd React-Realtime-Chat
npm install
```

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm start
```

### Heroku
You can create your own Heroku server or view the example: https://slack-in-react.herokuapp.com
```bash
heroku create
git push heroku master
heroku addons:create heroku-postgresql:hobby-dev
heroku ps:scale web=1 && heroku open
```

## Contributing
I am more than happy to accept external contributions to the project in the form of feedback, bug reports, and of course - pull requests :)

Ease of understanding and simplicity are important to the longevity of this project, so if you find a simpler way of doing something, feel free to share!

---

Made by Adam King, Copyright © 2016, licensed under the [MIT License](https://github.com/adamjking3/React-Realtime-Chat/blob/master/LICENSE).
