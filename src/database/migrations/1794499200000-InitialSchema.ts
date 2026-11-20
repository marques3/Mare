import { MigrationInterface, QueryRunner } from 'typeorm';
export class InitialSchema1794499200000 implements MigrationInterface {
 name = 'InitialSchema1794499200000';
 async up(q: QueryRunner):Promise<void> {
  await q.query("CREATE TABLE users (id varchar(36) NOT NULL PRIMARY KEY, email varchar(254) NOT NULL, passwordHash varchar(255) NOT NULL, createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), UNIQUE KEY users_email_unique (email)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci");
  await q.query("CREATE TABLE auth_sessions (tokenHash char(64) NOT NULL PRIMARY KEY, userId varchar(36) NOT NULL, expiresAt datetime(3) NOT NULL, createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), KEY sessions_user (userId), KEY sessions_expiry (expiresAt), CONSTRAINT sessions_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci");
  await q.query("CREATE TABLE profiles (userId varchar(36) NOT NULL PRIMARY KEY, settings json NOT NULL, language varchar(2) NOT NULL DEFAULT 'pt', watchEnabled tinyint NOT NULL DEFAULT 0, alertThreshold int NOT NULL DEFAULT 75, CONSTRAINT profiles_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci");
  await q.query("CREATE TABLE favorites (userId varchar(36) NOT NULL, spotId varchar(40) NOT NULL, PRIMARY KEY(userId,spotId), CONSTRAINT favorites_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci");
  await q.query("CREATE TABLE saved_sessions (id varchar(36) NOT NULL PRIMARY KEY, userId varchar(36) NOT NULL, spotId varchar(40) NOT NULL, startTime varchar(16) NOT NULL, snapshot json NOT NULL, createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), UNIQUE KEY saved_session_unique (userId,spotId,startTime), CONSTRAINT saved_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci");
  await q.query("CREATE TABLE forecast_cache (id varchar(32) NOT NULL PRIMARY KEY, fetchedAt datetime(3) NOT NULL, payload json NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci");
 }
 async down(q:QueryRunner):Promise<void> {for(const table of ['forecast_cache','saved_sessions','favorites','profiles','auth_sessions','users']) await q.query('DROP TABLE '+table);}
}
