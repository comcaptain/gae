package sgq.cmd.bean;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable = "true")
public class UserHistory {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@Extension(vendorName = "datanucleus", key = "gae.encoded-pk", value = "true")
	private String historyId;
	@Persistent
	private String userId;
	@Persistent
	private String wordId;
	@Persistent
	private long learnCount;
	@Persistent
	private long testCount;
	@Persistent
	private long testPassCount;
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getWordId() {
		return wordId;
	}

	public void setWordId(String wordId) {
		this.wordId = wordId;
	}

	public long getLearnCount() {
		return learnCount;
	}

	public void setLearnCount(long learnCount) {
		this.learnCount = learnCount;
	}

	public long getTestCount() {
		return testCount;
	}

	public void setTestCount(long testCount) {
		this.testCount = testCount;
	}

	public long getTestPassCount() {
		return testPassCount;
	}

	public void setTestPassCount(long testPassCount) {
		this.testPassCount = testPassCount;
	}

	public String getHistoryId() {
		return historyId;
	}

	public void setHistoryId(String historyId) {
		this.historyId = historyId;
	}
}
