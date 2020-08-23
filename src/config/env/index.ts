import { IEnv } from '../../v1/interfaces'

const envs: IEnv = {
  port: parseInt(process.env.PORT || '3001') as number,
  mongodb: process.env.MONGODB as string,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
}
export default envs
