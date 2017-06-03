// See for https://github.com/helmetjs/helmet for details of configuration

const helmetConfig =
{
  frameguard: {
    action: 'deny'
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      imgSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'" ],
      connectSrc : ["'self'", 'ws:'],
    }
  }
};

export default helmetConfig;
