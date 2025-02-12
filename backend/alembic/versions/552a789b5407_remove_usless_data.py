"""remove usless data

Revision ID: 552a789b5407
Revises: 30a51e52d90a
Create Date: 2025-02-12 16:57:49.643556

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '552a789b5407'
down_revision: Union[str, None] = '30a51e52d90a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
