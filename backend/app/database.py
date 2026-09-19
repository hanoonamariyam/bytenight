from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, Session
from .config import settings
from .models.db_models import Base

# Configure engine. For SQLite, need check_same_thread=False
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)
    if engine.dialect.name != "sqlite":
        return

    # create_all does not add columns to an existing SQLite table.
    inspector = inspect(engine)
    academic_columns = {
        column["name"] for column in inspector.get_columns("academic_records")
    }
    with engine.begin() as connection:
        if "academic_year" not in academic_columns:
            connection.execute(text(
                "ALTER TABLE academic_records ADD COLUMN academic_year VARCHAR(20)"
            ))
        if "semester" not in academic_columns:
            connection.execute(text(
                "ALTER TABLE academic_records ADD COLUMN semester VARCHAR(30)"
            ))
        connection.execute(text(
            "CREATE UNIQUE INDEX IF NOT EXISTS uq_academic_record_identity "
            "ON academic_records (student_id, academic_year, semester, subject, "
            "assessment_type, assessment_date)"
        ))
