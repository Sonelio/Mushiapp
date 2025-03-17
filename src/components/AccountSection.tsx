import styled from 'styled-components';

const AccountContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Username = styled.div`
  font-weight: 600;
  color: #333;
`;

const Email = styled.div`
  font-size: 0.9em;
  color: #666;
`;

export const AccountSection = () => {
  return (
    <AccountContainer>
      <AccountInfo>
        <Avatar src="/avatar.png" alt="User Avatar" />
        <div>
          <Username>John Doe</Username>
          <Email>john@example.com</Email>
        </div>
      </AccountInfo>
      {/* Remove or fix the incorrect link to non-existent account page */}
      {/* If you need an account page, you can replace this with a valid route */}
    </AccountContainer>
  );
}; 