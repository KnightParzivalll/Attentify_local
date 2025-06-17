import asyncio
from sqlalchemy import text
from app.database import async_session


async def clear_data():
    async with async_session() as session:
        tables_query = text(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'alembic_version';"
        )
        result = await session.execute(tables_query)
        tables = [row[0] for row in result.fetchall()]

        if not tables:
            print("No tables found to truncate.")
            return

        truncate_query = text(f"TRUNCATE TABLE {', '.join(tables)} CASCADE;")
        await session.execute(truncate_query)
        await session.commit()
        print("All data cleared except alembic_version.")


if __name__ == "__main__":
    asyncio.run(clear_data())
