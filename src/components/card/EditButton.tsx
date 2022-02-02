import React, { memo } from 'react';
import tw, { styled, css } from 'twin.macro';
import { Edit } from '@styled-icons/boxicons-regular/Edit';


const StyledEditIcon = styled(Edit)<{ $isEdit: boolean, $editTimer: number }>`
  ${tw`absolute top-1.5 right-1 min-w-min opacity-50 stroke-1 stroke-current text-coolGray-50 cursor-pointer`};
  filter: drop-shadow(0px 1px 0 black);
  --duration: ${({ $editTimer }) => `${$editTimer}ms`};
  transition: all var(--duration) linear;
  ${({ $isEdit }) => !$isEdit && css`
    &:hover {
      ${tw`opacity-70`};
    }
  `}
  ${({ $isEdit }) => $isEdit && css`
    --neon-light-center: #f9fafb;
    --neon-light-color: #0d9488;
    --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                    drop-shadow(0 0 6px var(--neon-light-center))
                    drop-shadow(0 0 8px var(--neon-light-center))
                    drop-shadow(0 0 12px var(--neon-light-center))
                    drop-shadow(0 0 16px var(--neon-light-color));
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
    transition: all var(--duration) linear;
  `}
`;

const EditButton = ({ isEdit, editTimer, handleIsEdit }: { isEdit: boolean; editTimer: number; handleIsEdit: Function }) => (
  <StyledEditIcon size={22} $isEdit={isEdit} $editTimer={editTimer} onClick={() => handleIsEdit()} />
);

export default memo(EditButton);