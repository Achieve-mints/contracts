import { config as dotenvConfig } from "dotenv";
dotenvConfig();

interface IConfig {
  snowtrace: {
    api_key: string;
  },
  fuji: {
    provider_url: string;
    private_key: string;
  };
  iotest: {
    provider_url: string;
    private_key: string;
    alphatester_private_key: string;
  };
  io: {
    provider_url: string;
    private_key: string;
    alphatester_private_key: string;
  };
}

export const getEnv = (key: string, defaultValue?: any) => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue === undefined || defaultValue === null) {
      throw new Error(`Required env var ${key} not set`);
    } else {
      return defaultValue;
    }
  }
  if (value.toLocaleLowerCase() === "false") {
    return false;
  }
  if (value.toLocaleLowerCase() === "true") {
    return true;
  }
  return value;
};

export const envconfig: IConfig = {
  snowtrace: {
    api_key: getEnv("SNOWTRACE_API_KEY", ""),
  },
  fuji: {
    provider_url: getEnv("FUJI_PROVIDER_URL", ""),
    private_key: getEnv("FUJI_PRIVATE_KEY", ""),
  },
  iotest: {
    provider_url: getEnv("IOTEST_PROVIDER_URL", ""),
    private_key: getEnv("IOTEST_PRIVATE_KEY", ""),
    alphatester_private_key: getEnv("IOTEST_ALPHATESTER_PRIVATE_KEY", ""),
  },
  io: {
    provider_url: getEnv("IO_PROVIDER_URL", ""),
    private_key: getEnv("IO_PRIVATE_KEY", ""),
    alphatester_private_key: getEnv("IO_ALPHATESTER_PRIVATE_KEY", ""),
  },
};
