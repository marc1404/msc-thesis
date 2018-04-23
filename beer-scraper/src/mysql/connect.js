import { connect } from '@rich_harris/sql';
import mysqlConfig from './mysqlConfig';

export default async () => connect(mysqlConfig);