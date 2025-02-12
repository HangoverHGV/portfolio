"""remove usless data

Revision ID: 30a51e52d90a
Revises: eedeb95cb510
Create Date: 2025-02-12 16:55:36.636534

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '30a51e52d90a'
down_revision: Union[str, None] = 'eedeb95cb510'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
