package sgq.cmd.action;

import java.io.IOException;
import java.util.List;

import javax.jdo.PersistenceManager;

import sgq.cmd.bean.UserHistory;
import sgq.cmd.util.PMF;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.appengine.api.users.UserServiceFactory;
import com.opensymphony.xwork2.ActionSupport;

public class SynchronizeUserData extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5800930613368438803L;
	private String data;
	private String result;
	public String getData() {
		return data;
	}
	public void setData(String data) throws JsonParseException, JsonMappingException, IOException {
		this.data = data;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String execute(){
		ObjectMapper mapper = new ObjectMapper();
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			List<UserHistory> records = mapper.readValue(this.data, new TypeReference<List<UserHistory>>(){});
			String userId = UserServiceFactory.getUserService().getCurrentUser().getEmail();
			for (UserHistory userHistory: records) {
				if (userHistory.getHistoryId() != null && !"".equals(userHistory.getHistoryId())) {
					UserHistory oldUserHistory = pm.getObjectById(UserHistory.class, userHistory.getHistoryId());
					oldUserHistory.updateFromDTO(userHistory);
				}
				else {
					userHistory.setUserId(userId);
					pm.makePersistent(userHistory);
				}
			}
			this.result = SUCCESS;
		}
		catch(Exception e) {
			this.result = ERROR;
		}
		finally {
			pm.close();
		}
		return SUCCESS;
	}
}
