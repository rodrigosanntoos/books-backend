import { IEnv } from '../../v1/interfaces'

const envs: IEnv = {
  port: parseInt(process.env.PORT || '3001') as number,
  mongodb: process.env.MONGODB as string,
}
export default envs
