# Documentation

### database structure
#### use JSONB for each parts to store asset id and color data
| id  | userid  | bio         | gender | serial_num | location | birthday | Head | Eyes | Eyebrows | Nose | Mouth | Ears | Hair | Top | Bottom | Shoes |
|-----|---------|-------------|--------|------------|----------|----------|------|------|----------|------|-------|------|------|-----|--------|-------|
| 0   | 18      | "bio"       | Male   | "TCG-001"  | "SF"     |          | {8, #ffff} | {3, color} | {13, color} |      |       |      | 22   | 31  |        | 30    |

#### create separate parts table and Join with userCustom table
userCustom table
| id  | userid  | bio         | gender | serial_num | location | birthday | 
|-----|---------|-------------|--------|------------|----------|----------|
| 0   | 18      | "bio"       | Male   | "TCG-001"  | "SF"     |          | 

parts table
| id  | userid  | name | color |
|-----|---------|------|------ |
| 0   | 18      | Head | #ffff | 
| 1   | 18      | Hair | #ffff | 
| 2   | 18      | Top | #ffff | 

use map to rap parts for READ
const parts = result.rows.map(row => ({
    part_id: row.part_id,
    part_type: row.part_type,
    part_item_id: row.part_item_id,
    color: row.color,
  })).filter(part => part.part_id !== null);

  return { ...user, parts };